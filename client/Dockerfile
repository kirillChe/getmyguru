FROM node:10.15.3-stretch
RUN mkdir -p /app
WORKDIR /app
RUN npm install -g pm2
RUN apt-get update && apt-get install vim -y
COPY package.json /app
COPY package-lock.json /app
RUN npm install -g




#FROM node:10.15.3-stretch
#
#RUN mkdir -p /app
#
#RUN apt-get update && apt-get install vim -y
#RUN npm i npm@latest -g
#
#WORKDIR /app
#COPY package.json /app
#COPY package-lock.json /app
#RUN npm install && npm cache clean --force
#
#COPY . /app








#FROM kirillche/bmern
#RUN mkdir -p /app
#WORKDIR /app
#RUN apt-get update && apt-get install vim -y
#COPY package.json /app
#COPY package-lock.json /app
#RUN npm install -g
