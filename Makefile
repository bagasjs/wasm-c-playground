CC=clang

WASM_CFLAGS=--target=wasm32 --no-standard-libraries 
WASM_LFLAGS=-Wl,--allow-undefined -Wl,--export-all, -Wl,--no-entry


run: index.wasm
	python -m http.server 8000

index.wasm: ./webcore.c ./main.c
	$(CC) $(WASM_CFLAGS) -o $@ $^ $(WASM_LFLAGS)
