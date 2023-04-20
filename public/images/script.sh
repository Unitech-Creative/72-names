#!/bin/bash

# Set the path to your SVG folder
svg_path="/Users/ordin/dev/72-next/public/images/svgs"

# Loop through all SVG files in the folder
for svg_file in $svg_path/*.svg; do

  # Get the filename without the path or extension
  filename=$(basename "$svg_file")
  name="${filename%.*}"
  extension="${filename##*.}"

  # Extract the number part of the filename
  n="${name#*-}"

  # Ignore files whose number part is less than 11
  if [ "$n" -lt 11 ]; then
    echo "Ignoring $svg_file"
    continue
  fi

  echo "Processing $svg_file"

  # Use sed to remove the width and height attributes from the main <svg> tag
  sed -i '' -e 's/width="[^"]*"//g' -e 's/height="[^"]*"//g' $svg_file

  # Use sed and read to extract the values of the viewBox attribute
  vb=$(perl -0777 -ne 'if (/viewBox="([0-9. ,-]+)"/) { my @nums = split(/ /, $1); my @clean_nums = map { ($_ =~ /\.0*$/) ? int($_) : $_ } @nums; print join(" ", @clean_nums) . "\n"; }' "$svg_file")


  if [ -z "$vb" ]; then
    echo "Unable to extract viewBox from $svg_file"

    continue
  fi
  echo "viewBox values: $vb"
  read x y w h <<<"$vb"

  # echo "w: $w, h: $h"

  # Set default values for w and h if they are empty
  w="${w:-0}"
  h="${h:-0}"

  # Construct the new viewBox value using the extracted values
  new_vb="0 -60 $w 180"

  # Use sed to replace the viewBox attribute with the new value
  sed -i '' -e "s/viewBox=\"[^\"]*\"/viewBox=\"$new_vb\"/g" $svg_file

done
