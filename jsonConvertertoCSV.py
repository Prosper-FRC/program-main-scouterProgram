import pandas as pd
dataframe = pd.read_json(r"/Users/nikhil4474/Desktop/Scouter Program Main/Configs/package.json")
dataframe.to_csv(r"/Users/nikhil4474/Desktop/Scouter Program Main/Configs/package.csv")