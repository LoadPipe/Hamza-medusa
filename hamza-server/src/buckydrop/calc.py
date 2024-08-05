import hashlib
import json

# Example values
appCode = '0077651952683977'
jsonParams = json.dumps({"productLink": "https://detail.1688.com/offer/649443515944.html"})  # JSON object as a string
timestamp = '1706774929000'
appSecret = 'b9486ca7a7654a8f863b3dfbd9e8c100'

# Concatenate parameters
data_to_sign = appCode + jsonParams + timestamp + appSecret

# Calculate MD5
signature = hashlib.md5(data_to_sign.encode()).hexdigest()

print("Computed Signature:", signature)
