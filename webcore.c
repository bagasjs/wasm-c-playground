#include "webcore.h"

#include <stdarg.h>

void webRunCommmonCallback(PFN_webCommonCallback pCallback, void *pData)
{
    pCallback(pData);
}

void webRunOnFrameCallback(PFN_webOnFrameCallback pCallback, double timestamp, void *pData)
{
    pCallback(timestamp, pData);
}
