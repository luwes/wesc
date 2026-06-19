/*
 * C ABI for the `wesc` web-component bundler (crates/wesc-go).
 *
 * These declarations mirror the `extern "C"` surface in
 * crates/wesc-go/src/lib.rs and are consumed from Go via cgo (see wesc.go).
 * Keep them in sync with the Rust source.
 */

#ifndef WESC_H
#define WESC_H

#include <stddef.h>
#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

/*
 * Result of wesc_build: an owned byte buffer, or an error.
 *
 * On success `error` is NULL and `data`/`len` hold the output. On failure
 * `data` is NULL, `len`/`cap` are 0, and `error` is a heap string. Either way,
 * pass the value to wesc_buffer_free exactly once to release it.
 */
typedef struct WescBuffer {
    uint8_t *data;
    size_t len;
    size_t cap;
    char *error;
} WescBuffer;

/* Invoked once per output chunk by wesc_build_stream. `user_data` is threaded
 * through untouched; `chunk`/`len` are valid only for the duration of the call.
 * The chunk pointer is non-const purely to match the prototype cgo generates
 * for the exported Go callback; the bytes must not be mutated. */
typedef void (*WescChunkCallback)(uintptr_t user_data, uint8_t *chunk, size_t len);

/* Build the entry points and return the HTML output. `out_css` / `out_js`, when
 * non-NULL, are filled with the bundled CSS/JS (their `data` is NULL when that
 * bundle wasn't requested). Free the returned buffer and each of `out_css` /
 * `out_js` with wesc_buffer_free. `minify` is treated as a boolean (non-zero is
 * true). */
WescBuffer wesc_build(const char *const *input,
                      size_t input_len,
                      const char *outcss,
                      const char *outjs,
                      int minify,
                      WescBuffer *out_css,
                      WescBuffer *out_js);

/* Stream the build to `callback`, chunk by chunk. Returns NULL on success, or a
 * heap error string to free with wesc_string_free. */
char *wesc_build_stream(const char *const *input,
                        size_t input_len,
                        const char *outcss,
                        const char *outjs,
                        int minify,
                        WescChunkCallback callback,
                        uintptr_t user_data);

/* Release a buffer returned by wesc_build. */
void wesc_buffer_free(WescBuffer buffer);

/* Release a string returned by wesc_build_stream. */
void wesc_string_free(char *s);

#ifdef __cplusplus
}
#endif

#endif /* WESC_H */
