#include <EEPROM.h>

long convertBin2[] = {1,  2,  4,  8,  16,  32,  64,  128};
long convertBin[] =  {1,  2,  4,  8,  16,  32,  64,  128,  256,  512,  1024,  2048,  4096,  8192,  16384,  32768};
long storeBin[] =    {0,  0,  0,  0,  0,    0,    0,   0,    0,    0,     0,     0,     0,     0,      0,      0};
long holdVal = 0;
long byteVal = 0;
long readVal = 0;
long readVal2 = 0;

/* ****************************** START WRITE ****************************** */
void writeLong(long value){
  int x = 15;
  for (int i = 1; value > 0 ; i++){
    holdVal = value;
    value -= convertBin[x];
    if (value < 0){
      value = holdVal;
      x -= 1;
    } else {
      x -= 1;
    }
    if (holdVal != value){
      storeBin[x+1] = 1;
    }
  }
  for (int i = 0; i <= 7; i++){
    if (storeBin[i] == 1){
      byteVal += convertBin2[i];
    };
  }
  EEPROM.write(0,byteVal);
  byteVal = 0;
  for (int i = 8; i <= 15; i++){
    if (storeBin[i] == 1){
      byteVal += convertBin2[i];
    };
  }
  EEPROM.write(1,byteVal);
  byteVal = 0;
  
}
/* ****************************** END WRITE ****************************** */

/* ****************************** START READ ****************************** */
long readLong(long readData){
  long readBin[] =     {0,  0,  0,  0,  0,    0,    0,   0};
  long readBin2[] =    {0,  0,  0,  0,  0,    0,    0,   0};
  readData = 0;
  /* *************** START READ 0 ****************/
  readVal = EEPROM.read(0);
  int x = 7;
  for (int i = 0; readVal > 0; i++){
    holdVal = readVal;
    readVal -= convertBin2[x];
    if (readVal < 0){
      readVal = holdVal;
      x -= 1;
    } else {
      x -= 1;
    }
    if (holdVal != readVal){
      readBin[x+1] = 1;
    }
  }
  for (int i = 7; i >= 0; i--){
    if (readBin[i] == 1){
      readVal += convertBin[i];
    }
  }
  /* *************** END READ 0 ****************/
  /* *************** START READ 1 ****************/
  readVal2 = EEPROM.read(1);
  x = 7;
  for (int i = 0; readVal2 > 0; i++){
    holdVal = readVal2;
    readVal2 -= convertBin2[x];
    if (readVal2 < 0){
      readVal2 = holdVal;
      x -= 1;
    } else {
      x -= 1;
    }
    if (holdVal != readVal2){
      readBin2[x+1] = 1;
    }
  }
  for (int i = 7; i >= 0; i--){
    if (readBin2[i] == 1){
      readVal2 += convertBin[i+8];
    }
  }
  /* *************** END READ 1 ****************/
  readData = readVal + readVal2;
  return readData;
}
/* ****************************** END READ ****************************** */
