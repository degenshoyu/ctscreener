FROM node:18

RUN apt-get update && apt-get install -y ca-certificates \
    python3 \
    make \
    g++ \
    libpng-dev \
    libcairo2-dev \
    libjpeg-dev \
    libpango1.0-dev \
    libgif-dev \
    build-essential \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "run", "dev"]
