import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import AIMessage
from langchain_core.output_parsers import StrOutputParser

#import the OpenAI API key from the .env file
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
# LLMs
llm = ChatOpenAI(model="gpt-4o-mini", api_key=OPENAI_API_KEY)
gen_ideas_prompt = ChatPromptTemplate.from_template("""You are a clever work assistant that helps people generate ideas for their project, research, paper or any other creative work. You'll be having a query from the user and you need to generate 5 (five) diverse, detailed, developed, precise and significant ideas related to the context of the query. The ideas should not be redundant and repetitive, be creative and unique. The ideas must be formatted in the form of bullet points without titles and without bold text.
Query:{query}
List of 5 bullet points ideas:""")


# parsers
def parse_bullet_points(ai_message: AIMessage) -> list:
    # Extract the content from the AIMessage object
    content = ai_message.content

    # Split the content into lines
    lines = content.split('\n')

    # Initialize an empty list to hold the parsed bullet points
    bullet_points = []

    # Iterate over each line
    for line in lines:
        # Strip leading and trailing whitespace
        stripped_line = line.strip()

        # Check if the line starts with a bullet point indicator
        if stripped_line.startswith('- '):
            # Remove the bullet point indicator and any leading/trailing whitespace
            bullet_point = stripped_line[2:].strip()
            # Append the cleaned bullet point to the list
            bullet_points.append(bullet_point)
        elif stripped_line.startswith('-'):
            # Handle cases where there's no space after the bullet point indicator
            bullet_point = stripped_line[1:].strip()
            bullet_points.append(bullet_point)
        elif stripped_line:
            # Handle lines that are part of a bullet point but don't start with '-'
            if bullet_points:
                # Append this line to the last bullet point, adding a space
                bullet_points[-1] += ' ' + stripped_line

    return bullet_points


class TreeNode:
    def __init__(self, idea):
        self.idea = idea
        self.children = []

    def add_child(self, child_node):
        self.children.append(child_node)

class InitialIdeaChain:
    def __init__(self):
        self.gen_ideas_prompt = gen_ideas_prompt
        self.llm = llm
        self.chain = self.gen_ideas_prompt | self.llm | parse_bullet_points

    def invoke(self, query):
        self.initial_ideas = self.chain.invoke({"query": query})
        return self.initial_ideas

# print the tree creating a string representation of the tree
def print_tree(node, indent=0, is_root=True):
    # Skip the root node by only printing its children
    string = ""
    if not is_root:
        string += "  " * indent + "- " + node.idea + "\n"
    for child in node.children:
        string += print_tree(child, indent + 1, is_root=False)
    return string
