import requests

a = {"total" : "20202"}
print(type(a))
r = requests.post("http://127.0.0.1:7000/data2",a)
print(r)