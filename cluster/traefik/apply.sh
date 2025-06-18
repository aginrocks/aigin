#!/bin/bash

kubectl apply -f 00-account.yaml
kubectl apply -f 00-role.yaml
kubectl apply -f 01-role-binding.yaml
kubectl apply -f 02-traefik.yaml
kubectl apply -f 02-traefik-services.yaml
kubectl apply -f 03-traefik-ingressclass.yaml