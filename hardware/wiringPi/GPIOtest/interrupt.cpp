#include<iostream>
#include"wiringPi.h"
#include<cstdlib>
#include<iostream>    
#include<time.h>   
using namespace std;

void ButtonPressed(void);
void setup();
long tim ,timnow;

/********************************/
const int LEDPin = 11;
const int ButtonPin = 1;
/*******************************/
int Speed;
int main()
{
     
    setup();

    //注册中断处理函数
    // if(0>wiringPiISR(ButtonPin,INT_EDGE_FALLING,ButtonPressed))
    // {
     //     cerr<<"interrupt function register failure"<<endl;
    //     exit(-1);
    // }

tim = micros();
    while(1)
    {       
        timnow= micros();
        if( timnow - tim >= 1000000 && timnow - tim <= 1000010)
        {
	    tim += 1000000;
            Speed = rand()/10000;
            cout<<Speed<<endl;          
        }
    }
    return 0;
}

void setup()
{
    if(-1==wiringPiSetup())
    {
        cerr<<"wiringPi setup error"<<endl;
        exit(-1);
    }
    
    pinMode(LEDPin,OUTPUT);    //配置11脚为控制LED的输出模式
    digitalWrite(LEDPin,LOW);  //初始化为低电平

    pinMode(ButtonPin,INPUT);            //配置1脚为输入
    pullUpDnControl(ButtonPin,PUD_UP);  //将1脚上拉到3.3v

}


//中断处理函数：反转LED的电平
void ButtonPressed(void)
{

    digitalWrite(LEDPin,  (HIGH==digitalRead(LEDPin))?LOW:HIGH );

}
