from typing import Dict, List, Optional
from langchain.agents import Tool, AgentExecutor, LLMSingleActionAgent
from langchain.prompts import StringPromptTemplate
from langchain.chat_models import ChatOpenAI
from langchain.schema import AgentAction, AgentFinish
import re
import json

class AdaptiveLearningAgent:
    def __init__(self, openai_api_key: str):
        self.llm = ChatOpenAI(temperature=0, openai_api_key=openai_api_key)
        self.tools = self._create_tools()
        self.agent_executor = self._create_agent()

    def _create_tools(self) -> List[Tool]:
        """Create tools for the agent to use"""
        return [
            Tool(
                name="GetStudentProfile",
                func=self._get_student_profile,
                description="Get the student's learning profile and history"
            ),
            Tool(
                name="GetLearningContent",
                func=self._get_learning_content,
                description="Retrieve learning content based on student's needs"
            ),
            Tool(
                name="UpdateProgress",
                func=self._update_progress,
                description="Update student's learning progress"
            ),
            Tool(
                name="GenerateAssessment",
                func=self._generate_assessment,
                description="Generate assessment based on learning content"
            )
        ]

    def _create_agent(self) -> AgentExecutor:
        """Create the agent executor"""
        prompt = AdaptiveLearningPrompt()
        llm_chain = LLMChain(llm=self.llm, prompt=prompt)
        
        agent = LLMSingleActionAgent(
            llm_chain=llm_chain,
            allowed_tools=[tool.name for tool in self.tools],
            stop=["\nObservation:"],
            handle_parsing_errors=True
        )
        
        return AgentExecutor.from_agent_and_tools(
            agent=agent,
            tools=self.tools,
            verbose=True
        )

    def adapt_learning_path(self, student_id: str, current_context: Dict) -> Dict:
        """Adapt the learning path based on student's needs and context"""
        # Prepare the input for the agent
        input_data = {
            "student_id": student_id,
            "current_context": current_context
        }
        
        # Execute the agent
        result = self.agent_executor.run(input_data)
        
        return self._parse_agent_result(result)

    def _get_student_profile(self, student_id: str) -> Dict:
        """Get student's learning profile"""
        # Implementation would fetch from database
        return {
            "learning_style": "visual",
            "proficiency_level": "intermediate",
            "learning_history": []
        }

    def _get_learning_content(self, query: str) -> List[Dict]:
        """Get relevant learning content"""
        # Implementation would use RAG system
        return []

    def _update_progress(self, student_id: str, progress_data: Dict) -> bool:
        """Update student's learning progress"""
        # Implementation would update database
        return True

    def _generate_assessment(self, content_id: str) -> Dict:
        """Generate assessment for learning content"""
        # Implementation would generate assessment
        return {}

    def _parse_agent_result(self, result: str) -> Dict:
        """Parse the agent's result into a structured format"""
        try:
            return json.loads(result)
        except:
            return {"error": "Failed to parse agent result"}

class AdaptiveLearningPrompt(StringPromptTemplate):
    template = """You are an adaptive learning AI assistant. Your goal is to help students learn effectively by providing personalized content and guidance.

Current Context:
{current_context}

Student Profile:
{student_profile}

Available Tools:
{tools}

Use the following format:
Thought: Consider what the student needs
Action: Choose a tool to use
Action Input: Input for the tool
Observation: Result of the tool
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: The final answer to the original input question

Begin!

Thought: {agent_scratchpad}"""

    def format(self, **kwargs) -> str:
        # Format the prompt with the available tools
        tools_str = "\n".join([f"{tool.name}: {tool.description}" for tool in kwargs["tools"]])
        kwargs["tools"] = tools_str
        return self.template.format(**kwargs) 