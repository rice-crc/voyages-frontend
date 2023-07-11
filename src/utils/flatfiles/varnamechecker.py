import os
import re
import json
import requests

url = "http://127.0.0.1:8000/voyage/?hierarchical=False"

payload = {}
headers = {
  'Authorization': 'Token 1e22e84d595abfb2c5d3984fba74179e57442fc1'
}

response = requests.request("OPTIONS", url, headers=headers, data=payload)

print(response.status_code)

options=json.loads(response.text)

valid_varnames=list(options.keys())


def readtxtfile(filepath):
	d=open(filepath)
	t=d.read()
	d.close()
	return(t)

flatfilenames=[f for f in os.listdir('.') if f.endswith('.json')]

for ffn in flatfilenames:
	print("-->",ffn)
	t=readtxtfile(ffn)
	varnames=[re.search('[a-z|A-z|_]+',i).group(0) for i in re.findall("(?<=\"var_name\")\s*:\s*\"[a-z|A-z|_]+",t) if i is not None]
	for vn in varnames:
		if vn not in valid_varnames:
			print("invalid:",vn)