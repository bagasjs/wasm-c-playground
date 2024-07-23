#ifndef WEBCORE_H_
#define WEBCORE_H_

typedef void (*PFN_webCommonCallback)(void *pUserData);
typedef void (*PFN_webOnFrameCallback)(double timestamp, void *pUserData);

extern void webConsoleWrite(const char *message);
extern void webConsoleError(const char *message);
extern void webSetOnExitCallback(PFN_webCommonCallback pCallback, void *pUserData);

extern void webSetOnFrameCallback(PFN_webOnFrameCallback pCallback, void *pUserData);
extern void webStopFrameLoop(void);

#endif // WEB_CORE_H_
