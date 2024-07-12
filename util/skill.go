package util

import (
	"database/sql"

	"github.com/lib/pq"
)

type SkillDB struct {
	Key         string         `json:"key"`
	Name        sql.NullString `json:"name"`
	Description sql.NullString `json:"description"`
	Logo        sql.NullString `json:"logo"`
	Tags        pq.StringArray `json:"tags"`
}

type SkillData struct {
	Key         string
	Name        string
	Description string
	Logo        string
	Tags        []string
}

func Skill(val SkillDB) SkillData {
	var skill SkillData
	skill.Key = val.Key
	skill.Description = val.Description.String
	skill.Logo = val.Logo.String
	skill.Name = val.Name.String
	skill.Tags = val.Tags
	return skill
}
