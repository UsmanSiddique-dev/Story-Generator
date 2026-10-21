from typing import List ,Dict ,Any,Optional

from pydantic import BaseModel ,Field, ConfigDict



class StoryOptionLLM(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    text:str=Field(description="the text of the option for the user to choose ")
    next_node:Dict[str,Any]=Field(alias="nextNode",description="the next node content and its options")

class StoryNodeLLM(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    content:str=Field(description="the  main content of the story node")
    isEnding:bool=Field(alias="isEnding",description="if this node is ending")
    isWinningEnding:bool=Field(alias="isWinningEnding",description="if this node is winning ending")
    options:Optional[List[StoryOptionLLM]]=Field(default=None,description="list of options")

class StoryLLMResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    title:str=Field(description="the title of the story")
    root_node:StoryNodeLLM=Field(alias="rootNode",description="the root node of story")