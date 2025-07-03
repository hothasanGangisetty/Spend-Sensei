import google.generativeai as genai
import os
import PIL.Image

try:
    # The GOOGLE_API_KEY environment variable is used automatically.
    genai.configure(api_key=os.environ["GOOGLE_API_KEY"])

    # Replace "your-receipt-image.png" with the actual filename of your receipt image
    img = PIL.Image.open("your-receipt-image.png")

    model = genai.GenerativeModel('gemini-1.5-flash')

    # The prompt to the model
    prompt = """
    Analyze the text from this receipt and perform the following tasks:
    1.  Categorize each line item into one of the following categories: Food, Personal Care, or Household.
    2.  Calculate the total amount spent in each category.
    3.  Provide a summary of the spending by category.
    4.  Suggest one simple, practical, and friendly savings tip based on the items purchased.
    """

    response = model.generate_content([prompt, img])
    print(response.text)
    print("\nSuccessfully analyzed the receipt!")

except FileNotFoundError:
    print("Error: The image file was not found. Please make sure the filename is correct and the image is in the same folder as the script.")
except Exception as e:
    print(f"An error occurred: {e}")
