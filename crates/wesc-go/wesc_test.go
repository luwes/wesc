package wesc_test

import (
	"bytes"
	"os"
	"path/filepath"
	"runtime"
	"testing"

	"github.com/luwes/wesc/crates/wesc-go"
)

// fixtureEntry returns an absolute path to a bundler test fixture and chdirs the
// test into a scratch dir, so wesc's `.wesc/` working dir doesn't litter the
// repo. The original working directory is restored on cleanup.
func fixtureEntry(t *testing.T, name string) string {
	t.Helper()

	_, thisFile, _, ok := runtime.Caller(0)
	if !ok {
		t.Fatal("could not locate test source file")
	}
	repoRoot := filepath.Join(filepath.Dir(thisFile), "..", "..")
	entry := filepath.Join(repoRoot, "crates", "wesc", "tests", "fixtures", name, "index.html")

	cwd, err := os.Getwd()
	if err != nil {
		t.Fatalf("getwd: %v", err)
	}
	if err := os.Chdir(t.TempDir()); err != nil {
		t.Fatalf("chdir: %v", err)
	}
	t.Cleanup(func() { _ = os.Chdir(cwd) })

	return entry
}

func TestBuild(t *testing.T) {
	entry := fixtureEntry(t, "default-slot")

	html, err := wesc.Build(wesc.Options{Input: []string{entry}})
	if err != nil {
		t.Fatalf("Build: %v", err)
	}
	if len(html) == 0 {
		t.Fatal("Build returned empty output")
	}
}

func TestBuildStreamMatchesBuild(t *testing.T) {
	entry := fixtureEntry(t, "default-slot")

	oneShot, err := wesc.Build(wesc.Options{Input: []string{entry}})
	if err != nil {
		t.Fatalf("Build: %v", err)
	}

	var streamed bytes.Buffer
	err = wesc.BuildStream(wesc.Options{Input: []string{entry}}, func(chunk []byte) error {
		streamed.Write(chunk)
		return nil
	})
	if err != nil {
		t.Fatalf("BuildStream: %v", err)
	}

	if !bytes.Equal(streamed.Bytes(), oneShot) {
		t.Fatalf("stream output (%d B) != one-shot output (%d B)", streamed.Len(), len(oneShot))
	}
}

func TestBuildStreamPropagatesCallbackError(t *testing.T) {
	entry := fixtureEntry(t, "default-slot")

	sentinel := os.ErrClosed
	err := wesc.BuildStream(wesc.Options{Input: []string{entry}}, func(chunk []byte) error {
		return sentinel
	})
	if err != sentinel {
		t.Fatalf("expected sentinel error, got %v", err)
	}
}
