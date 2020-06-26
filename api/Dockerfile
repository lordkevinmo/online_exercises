FROM node:8
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package*.json ./

RUN npm install
# Copy app source code
COPY . .

RUN chmod +x wait-for-it.sh

COPY wait-for-it.sh /usr/wait-for-it.sh
RUN chmod +x /usr/wait-for-it.sh

#Expose port and start application
EXPOSE 8080

## Launch the application
#CMD [ "npm","start"]