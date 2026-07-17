import os
import glob
import re

def check_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    style_blocks = re.findall(r'<style[^>]*>(.*?)</style>', content, re.DOTALL)
    for i, block in enumerate(style_blocks):
        # Remove comments
        block = re.sub(r'/\*.*?\*/', '', block, flags=re.DOTALL)
        
        open_count = block.count('{')
        close_count = block.count('}')
        if open_count != close_count:
            print(f"Mismatch in {filepath} (block {i+1}): {{ count = {open_count}, }} count = {close_count}")

for filepath in glob.glob("src/**/*.astro", recursive=True):
    check_file(filepath)
