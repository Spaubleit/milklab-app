#!/bin/bash
rm schema.graphqls schema.json queries-types.ts milklab-server/schema.json
cat ./milklab-server/src/main/resources/graphql/*.graphqls >> schema.graphqls &&
apollo-codegen introspect-schema schema.graphqls --output schema.json &&
cp schema.json milklab-server/schema.json
apollo-codegen generate **/*.graphql --schema schema.json --target typescript --output queries-types.ts &&
cp queries-types.ts milklab-client-ts-new/src/
