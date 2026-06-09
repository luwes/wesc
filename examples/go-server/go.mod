module github.com/luwes/wesc/examples/go-server

go 1.21

require github.com/luwes/wesc/crates/wesc-go v0.0.0

// Use the in-repo bindings rather than a published module.
replace github.com/luwes/wesc/crates/wesc-go => ../../crates/wesc-go
