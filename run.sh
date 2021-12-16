#!/usr/bin/env bash

docker exec bin/kafka-topics.sh --zookeeper localhost:22181 --create --topic compacted-topic --replication-factor 3 --partitions 3 --config min.insync.replicas=1 --config cleanup.policy=compact --config segment.bytes=1048576
