FROM golang:1.20-alpine

WORKDIR /app


COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY model ./model
COPY server ./server
COPY utils ./utils

COPY *.go ./

RUN go build -o /go-bin


CMD [ "/go-bin" ]