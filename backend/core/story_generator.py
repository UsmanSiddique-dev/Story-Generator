from sqlalchemy.orm import Session

from core.config import settings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser

from core.prompts import STORY_PROMPT
from models.story import Story,StoryNode
from core.model import StoryLLMResponse, StoryNodeLLM

from dotenv import load_dotenv
load_dotenv()
class StoryGenerator:

    @classmethod
    def _get_llm(cls):
        return ChatGoogleGenerativeAI(
            model="gemini-3.7-flash",
            api_key=settings.GOOGLE_API_KEY,
            temperature=0.8,
        )

    @classmethod
    def generate_story(
        cls, db: Session, session_id: str,
        theme: str = "fantasy") -> Story:

        llm = cls._get_llm()
        story_parser = PydanticOutputParser(pydantic_object=StoryLLMResponse)

        prompt = ChatPromptTemplate.from_messages([
            ("system", STORY_PROMPT),
            ("human", "Create a Story with this theme: {theme}")
        ]).partial(format_instructions=story_parser.get_format_instructions())  # Fix 2: added ()

        raw_response = llm.invoke(prompt.invoke({"theme": theme}))

        # raw_response.content may be a list of content blocks (e.g. [{'type': 'text', 'text': '...'}])
        # in newer langchain-google-genai versions. We must extract the plain string.
        content = raw_response.content if hasattr(raw_response, "content") else raw_response
        if isinstance(content, list):
            # Flatten all text blocks into a single string
            response_text = "".join(
                block["text"] if isinstance(block, dict) and "text" in block else str(block)
                for block in content
            )
        else:
            response_text = content

        story_structure = story_parser.parse(response_text)

        story_db = Story(title=story_structure.title, session_id=session_id)
        db.add(story_db)
        db.flush()

        # NOTE: root_node_data is parsed but not yet persisted to DB.
        # You will need to recursively save story nodes in a future step.
        root_node_data = story_structure.root_node
        if isinstance(root_node_data, dict):
            root_node_data = StoryNodeLLM.model_validate(root_node_data)
        cls._process_story_node(db,story_db.id,root_node_data,True)
        db.commit()
        return story_db
    @classmethod
    def _process_story_node(cls,db:Session,story_id:int,node_data:StoryNodeLLM,is_root =False)-> StoryNode:
        # StoryNodeLLM uses aliases (isEnding, isWinningEnding) but Python accesses them
        # via the field names defined in the model. With populate_by_name=True in model_config,
        # we access them by alias on the model instance directly.
        node=StoryNode(
            story_id=story_id,
            content=node_data.content,
            is_root=is_root,
            is_ending=node_data.isEnding,
            is_winning_ending=node_data.isWinningEnding,
            options=[]
        )
        db.add(node)
        db.flush()
        
        
        if not node.is_ending and (hasattr(node_data,"options")and node_data.options):
            options_list=[]
            for option_data in node_data.options:
                next_node=option_data.next_node
                if isinstance(next_node,dict):
                    next_node=StoryNodeLLM.model_validate(next_node)
                child_node=cls._process_story_node(db,story_id,next_node,False)
                options_list.append({
                    "text":option_data.text,
                    "node_id":child_node.id
                })
            node.options=options_list
        db.flush()    
        return node    