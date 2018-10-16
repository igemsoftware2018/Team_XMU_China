#include <iostream>
#include <stdlib.h>
#include <unistd.h>
#include <cstdio>
#include <time.h>

using namespace std;

int main()
{
    srand((unsigned)time(0));
    int k = rand();
    printf("%d\n", k);
    return 0;
}

