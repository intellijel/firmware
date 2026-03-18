#!/bin/sh
# Required: https://www.st.com/en/development-tools/stm32cubeprog.html#get-software

cd $( dirname -- "$0"; )
git pull

theSelectedFile="$(osascript -l JavaScript -e 'a=Application.currentApplication();a.includeStandardAdditions=true;a.chooseFile({withPrompt:"Select a .BIN to flash:",defaultLocation:"./bin/"}).toString()')"

if [ -n "$theSelectedFile" ]
then
while :
do
    /Applications/STMicroelectronics/STM32Cube/STM32CubeProgrammer/STM32CubeProgrammer.app/Contents/Resources/bin/STM32_Programmer_CLI -c port=swd -w $theSelectedFile 0x08000000 -rst
    read -n 1 -s -r -p "Press any key to program (CTRL-C to quit)..."
    clear
done
fi