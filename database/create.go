package database

import (
	"fmt"
	"log"
)

func CreateTable() {
	db := ConnectDB()
	createTb := `
	CREATE TABLE skill (
		key TEXT PRIMARY KEY,
		name TEXT NOT NULL DEFAULT '',
		description TEXT NOT NULL DEFAULT '',
		logo TEXT NOT NULL DEFAULT '',
		tags TEXT [] NOT NULL DEFAULT '{}'
	);
	`
	_, err := db.Exec(createTb)

	if err != nil {
		log.Fatal("can't create table", err)
	}

	fmt.Println("create table success")
}
