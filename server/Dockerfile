FROM node:10.15.3-stretch

RUN mkdir -p /opt/app

RUN apt-get update && apt-get install vim -y
RUN npm i npm@latest -g

WORKDIR /opt
COPY package.json package-lock.json* ./
RUN npm install && npm cache clean --force

WORKDIR /opt/app
COPY . /opt/app


#WORKDIR /app
#RUN npm install -g pm2
#COPY ./ ./
##COPY package.json /app
##COPY package-lock.json /app
#RUN npm install
