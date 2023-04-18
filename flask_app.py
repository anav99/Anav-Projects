# %%
from flask import Flask, request,render_template
import json
import numpy as np
from PIL import Image,ImageOps
import tensorflow as tf
import pickle
import os


# %%


app = Flask(__name__)
@app.route('/')
def home_page():
    return render_template("homepage.html")
count=0
dir=os.path.dirname(__file__)
file_path=os.path.join(dir,"model.pkl")
model=pickle.load(open(file_path,"rb"))
ans=0
data=None
@app.route('/result.html', methods=['GET','POST'])
def process_image():
    global count,ans,data
    if(request.method=="POST"):   
        #data = json.loads(request.data,strict=False)
        #imageData = data['imageData']
        #print(request.data)
        json_data=request.data.decode("utf-8")
        if(len(json_data)>0):
            data=json.loads(json_data,strict=False) 
            imageData=data["imageData"]
            arr=np.array(list(imageData.values()))
            arr=arr.reshape(50,50,4)
            arr=np.array(list(map(lambda x:255-x,arr))) 
            rgba_image=Image.fromarray(arr.astype(np.uint8))
            image=Image.new("RGB",rgba_image.size,(0,0,0))
            image.paste(rgba_image,mask=rgba_image.split()[3])
            image=ImageOps.invert(image)
            image=tf.image.central_crop(tf.convert_to_tensor(image),central_fraction=0.8)
            image=tf.image.resize(image,size=[28,28])
            image=tf.image.rgb_to_grayscale(image)
            count+=1
            result = model.predict(np.array(image).reshape(1,28,28,1)) 
            print(np.argmax(result))
            if(np.argmax(result)==count):
                ans+=1
            
            """ (train_x,train_y),(val_x,val_y)=mnist.load_data()
            
            train_x=np.array(train_x)
            train_x=train_x.flatten()
            model=SVC() 

            arr=arr.reshape(50,50,4)
            rgba_image=Image.fromarray(arr.astype(np.uint8)).resize((32,32))
            image=Image.new("RGB",rgba_image.size,(0,0,0))
            image.paste(rgba_image,mask=rgba_image.split()[3])
            image.save("rgb2.png")
            (train_x,train_y),(val_x,val_y)=mnist.load_data()
            # Process the image data here
            train_x=np.expand_dims(train_x,axis=-1)
            train_x=np.repeat(train_x,3,axis=-1)
            print(train_x.shape)
            train_x=tf.image.resize(tf.convert_to_tensor(train_x),[32,32])
            base_model=VGG16(input_shape=(32,32,3),include_top=False)
            model=Sequential([base_model,Dense(10,activation="softmax")])
            
            train_y=to_categorical(train_y,num_classes=10)
            model.compile(optimizer="adam",loss="categorical_crossentropy",metrics=["accuracy"])
            model.fit(train_x,train_y,epochs=10)
            result = model.predict(np.array(image)) 
            print(result)   """
            
        return render_template("result.html",value=[ans,data["hourHand"],data["minuteHand"]])
        
    else:
        return "False"
if __name__=='__main__':
    #RUNNING THE APP
    app.run()



