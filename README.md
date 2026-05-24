# SilentUOS
A userspace operating system that runs nothing but JavaScript.

## UML
```mermaid
---
title: Boot Sequence
---
flowchart LR;
    Entrypoint --- id1>Initialisation]
        --- id2>Rootfs Resolve]
        --- id3>Scheduler Init]
        --- id4>Scheduler loop]
```
```mermaid
---
title: Kernel Call
---
sequenceDiagram
    participant Kernel
    participant User
    participant USI as USI<br/>(Userspace Interface)
    Kernel ->> User: main.next()
    User ->> USI: yield* USI.cons.out('hi')
    USI ->> Kernel: KernelCall("usi_cons_out", 'hi')
    Note over User: Bypassed completely
    Note over Kernel: Executes system call
    Note over Kernel: Pauses execution
    Note over Kernel: Resumes execution
    Kernel ->> User: 
```
