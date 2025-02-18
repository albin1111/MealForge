import os

from transformers import GPT2LMHeadModel, GPT2Tokenizer

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
model_path = os.path.join(base_dir, "FINAL_MODEL","MODEL")

tokenizer = GPT2Tokenizer.from_pretrained(model_path)
model = GPT2LMHeadModel.from_pretrained(model_path)
tokenizer.pad_token = tokenizer.eos_token

def generateRecipe(input_prompt):
  inputs = tokenizer(
      input_prompt,
      return_tensors="pt",
      padding=True,
      truncation=True,
      add_special_tokens=True,
  )

  # Generate text with better parameters
  output_ids = model.generate(
      inputs['input_ids'],
      attention_mask=inputs['attention_mask'],
      max_length=300,
      num_return_sequences=1,
      temperature=0.7,
      top_k=50,
      top_p=0.9,
      pad_token_id=tokenizer.eos_token_id,
      do_sample=True
  )

  generated_text = tokenizer.decode(output_ids[0], skip_special_tokens=True)
  return generated_text
