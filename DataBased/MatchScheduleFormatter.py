import csv
import json
import os 
import glob 

path = "Databased"
FileDir = glob.glob(path + '/*.csv')

def CreateFileName():
    #generate scheudle 
    namenum = 0
    filename = 'schedule-' + str(namenum) + '.json'
    
    CheckFile = False
    TheFile = os.path.normpath(filename)
    # checked a file directory if it exhisted
    while CheckFile == False:
        if os.path.exists(TheFile) == True:
            namenum = namenum + 1
            filename = 'schedule-' + str(namenum) + '.json'
            TheFile = os.path.normpath(filename)
            print(filename)
        else:
            CheckFile = True
    return filename

x = 0
y = 0
print("file dir: "+ os.getcwd() + path)
print(FileDir)
for Files in FileDir:
    ScheLibary = {}
    
    MatchNum = -1
    CSVFile = open(Files, "r")
    reader = list(csv.reader(CSVFile, delimiter=","))
    
    x = x + 1
    
    for col in reader:
        MatchNum = MatchNum + 1
        y = 0
        templist = []
        if MatchNum != 0:
            for row in col:
                print(row)
                
                templist.append(row)
                
                y = y+1
                print(y)
            ScheLibary.update({MatchNum: {'blue': templist[3:6], 'red': templist[0:3]}})
        
    
       # print(x)
       
    outfile = open(CreateFileName(), "w")
    outfile.write(json.dumps(ScheLibary))
    
        
# print(ScheLibary["qm"])
print(x)
