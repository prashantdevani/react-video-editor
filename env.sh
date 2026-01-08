#!/bin/bash


echo "Generating env-config.js file..."

# Recreate config file
rm -rf ./env-config.js
touch ./env-config.js

# Add assignment
echo "window._env_ = {" >> ./env-config.js

# Read each line in .env file
# Each line represents key=value pairs
if [ -f .env ]; then
  while read -r line || [ -n "$line" ]; do
    # Skip comments and empty lines
    case "$line" in
      \#*|"") continue ;;
    esac

    # Split env variables by character `=`
    if echo "$line" | grep -q '='; then
      varname=$(echo "$line" | cut -d '=' -f 1)
      varvalue=$(echo "$line" | cut -d '=' -f 2-)
    else
      continue
    fi

    # Read value of current variable if exists as Environment variable
    # Use eval to get the value of the variable name stored in varname, safely
    eval "value=\${$varname}"
    
    # Otherwise use value from .env file
    if [ -z "$value" ]; then
      value=$varvalue
    fi

    # Append configuration property to JS file
    echo "  $varname: \"$value\"," >> ./env-config.js
  done < .env
fi

echo "}" >> ./env-config.js