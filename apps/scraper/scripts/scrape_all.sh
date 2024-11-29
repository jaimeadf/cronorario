#!/bin/bash

start_year=$(date +%Y)
end_year=1994

terms=""

for year in $(seq "${start_year}" "-1" "${end_year}"); do
  for period in "101" "102"; do
    terms+=" ${year}-${period}"
  done
done

pnpm scraper:start scrape ${terms} -o "${1}"