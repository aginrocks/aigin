#!/bin/bash

kubectl apply -f frontend-service.yaml
kubectl apply -f frontend.yaml
kubectl apply -f ingress.yaml