#!/bin/sh
# Required: https://www.st.com/en/development-tools/stm32cubeprog.html#get-software
while :
do
    /Applications/STMicroelectronics/STM32Cube/STM32CubeProgrammer/STM32CubeProgrammer.app/Contents/Resources/bin/STM32_Programmer_CLI -c port=swd --skipErase -w $1 0x08000000 -rst
    read -n 1 -s -r -p "Press any key to program (CTRL-C to quit)..."
    clear
done