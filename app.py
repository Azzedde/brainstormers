import os
from dotenv import load_dotenv
import streamlit as st
from methods.big_mind_mapping import bmm
from methods.reverse_brainstorm import rb
from methods.role_storming import rs
from methods.scamper import sc
from methods.six_hats import sh
from methods.starburtsting import sb
from langchain_openai import ChatOpenAI

load_dotenv()  # Load environment variables from .env file
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")  # Get the OpenAI API key from the environment variables
# Make the layout wide for better display
st.set_page_config(page_title="🧠 Brainstormers", layout="wide")

# Initialize the OpenAI model with the API key
llm = ChatOpenAI(model="gpt-4o-mini", api_key=OPENAI_API_KEY)

# App title and description
st.title("🧠 Brainstormers")
st.write("Welcome! Choose a brainstorming mode to start generating ideas for your project.")

# Define the brainstorming modes, their corresponding functions, and descriptions
modes = {
    "Big Mind Mapping": {
        "function": lambda query: bmm(query, llm),
        "description": "This involves creating a tree of ideas to explore the maximum amount of ideas in a very wide area. "
                        "This is perfect when you are lost and want to gather the maximum number of ideas."
    },
    "Reverse Brainstorming": {
        "function": lambda query: rb(query, llm),
        "description": "Instead of focusing on solutions, this technique involves identifying ways to cause a problem or "
                        "achieve the opposite effect. Perfect for spotting potential issues and coming up with innovative solutions."
    },
    "Role Storming": {
        "function": lambda query: rs(query, llm),
        "description": "Involves adopting the perspective of someone else to generate ideas. Great for gathering insights from different viewpoints."
    },
    "SCAMPER": {
        "function": lambda query: sc(query, llm),  # Pass `llm` to `sc`
        "description": "SCAMPER stands for Substitute, Combine, Adapt, Modify, Put to another use, Eliminate, and Reverse. "
                        "This method encourages thinking from multiple perspectives to generate diverse ideas."
    },
    "Six Thinking Hats": {
        "function": lambda query: sh(query, llm),
        "description": "This method, developed by Edward de Bono, looks at a problem from six different perspectives: "
                        "White (Data), Red (Emotions), Black (Risks), Yellow (Benefits), Green (Creativity), and Blue (Process management)."
    },
    "Starbursting": {
        "function": lambda query: sb(query, llm),
        "description": "Focuses on generating questions rather than answers using the 5 W's and 1 H (Who, What, Where, When, Why, How). "
                        "Ideal for comprehensive topic exploration."
    }
}

# Mode selection
mode_choice = st.selectbox("Select a brainstorming mode:", list(modes.keys()))

# Display the description of the selected mode
if mode_choice:
    st.write(f"**Mode selected:** {mode_choice}")
    st.write(modes[mode_choice]["description"])  # Display mode description

    # User input for idea description
    user_query = st.text_area("Describe your idea in detail to get started:",
                                "I want idea projects using LangChain that involves AI Agents and that solves social problems.")

    # Button to start the brainstorming process
    if st.button("Generate Ideas"):
        # Display a loading message
        with st.spinner("Generating ideas, please wait..."):
            # Call the function for the selected mode
            result = modes[mode_choice]["function"](user_query)
        
        # Display the result in markdown format
        st.markdown(result)
