#include "webcore.h"

#define STB_SPRINTF_IMPLEMENTATION
#include "stb_sprintf.h"

struct game_state {
    int player_x;
    int player_y;
};
static struct game_state state;

#define FMTBUF_CAP (32*1024)
char fmtbuf[FMTBUF_CAP] = {0};
#define WEB_PRINTF(...) do { \
        stbsp_snprintf(fmtbuf, sizeof(fmtbuf), __VA_ARGS__); \
        webConsoleWrite(fmtbuf); \
    } while(0)
        

void web_frame(double timestamp, void *data)
{
    if(data == 0) {
        WEB_PRINTF("Frame with data: %p, timestamp: %f", data, timestamp);
        return;
    }
    struct game_state *state = (struct game_state *)data;;
    WEB_PRINTF("Frame with data.player_x=%d, data.player_y=%d, timestamp: %f", state->player_x, state->player_y, timestamp);
    webStopFrameLoop();
}

int WebMain(void)
{
    state.player_x = 100;
    state.player_y = 100;
    webConsoleWrite("Hello, World");
    webSetOnFrameCallback(web_frame, &state);
    return 0;
}
