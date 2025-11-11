#!/bin/zsh

SESSIONNAME="zk-bbs-sem-project"
tmux has-session -t $SESSIONNAME &>/dev/null

if [ $? != 0 ]; then
    # Create new session with first window (bun)
    tmux new-session -s $SESSIONNAME -n bun -d
    # Window 1: bun operations (2 horizontal panes)
    tmux send-keys -t $SESSIONNAME:1 'cd client/' C-m
    tmux send-keys -t $SESSIONNAME:1 'pnpm run dev' C-m
    tmux split-window -h -t $SESSIONNAME:1
    tmux send-keys -t $SESSIONNAME:1.2 'cd server/' C-m
    tmux send-keys -t $SESSIONNAME:1.2 'nodemon src/app.js' C-m

    # Window 2: DB operations (2 horizontal panes)
    tmux new-window -t $SESSIONNAME -n db
    tmux send-keys -t $SESSIONNAME:2 'cd server/' C-m
    tmux send-keys -t $SESSIONNAME:2 'pnpm run db:local' C-m
    tmux split-window -h -t $SESSIONNAME:2
    tmux send-keys -t $SESSIONNAME:2 'cd server/' C-m
    tmux send-keys -t $SESSIONNAME:2.2 'pnpm run db:studio' C-m

    # Window 3: LazyGit
    tmux new-window -t $SESSIONNAME -n git

    # Focus first window (bun)
    tmux select-window -t $SESSIONNAME:1
fi

tmux -u attach -t $SESSIONNAME
