package service

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
	"github.com/putitaT/skill-backend/database"
	"github.com/putitaT/skill-backend/util"
)

var db = database.ConnectDB()

func Api(r *gin.Engine) {
	r.GET("/api/v1/skills/:key", getSkillByKey)
	r.GET("/api/v1/skills", getAllSkill)
	r.POST("/api/v1/skills", createSkill)
	r.PUT("/api/v1/skills/:key", updateSkillById)
	r.PATCH("/api/v1/skills/:key/actions/name", updateNameById)
	r.PATCH("/api/v1/skills/:key/actions/description", updateDescriptionById)
	r.PATCH("/api/v1/skills/:key/actions/logo", updateLogoById)
	r.PATCH("/api/v1/skills/:key/actions/tags", updateTagById)
	r.DELETE("/api/v1/skills/:key", deleteSkillById)
}

func getSkillByKey(ctx *gin.Context) {
	key := ctx.Param("key")
	sql := "SELECT key, name, description, logo, tags FROM skill where key=$1"
	row := db.QueryRow(sql, key)

	var skill util.SkillDB
	var res map[string]any
	err := row.Scan(&skill.Key, &skill.Name, &skill.Description, &skill.Logo, &skill.Tags)
	if err != nil {
		res = map[string]any{
			"status":  "error",
			"message": "Skill not found",
		}
		ctx.JSON(http.StatusNotFound, res)
	} else {
		res = map[string]any{
			"status": "success",
			"data":   util.Skill(skill),
		}
		ctx.JSON(http.StatusOK, res)
	}
}

func getAllSkill(ctx *gin.Context) {
	rows, err := db.Query("SELECT key, name, description, logo, tags FROM skill ORDER BY key")
	var res map[string]any
	if err != nil {
		res = map[string]any{
			"status":  "error",
			"message": "Can't get all skill",
		}
		ctx.JSON(http.StatusNotFound, res)
	} else {
		skills := []util.SkillData{}
		for rows.Next() {
			var skill = util.SkillDB{}
			err := rows.Scan(&skill.Key, &skill.Name, &skill.Description, &skill.Logo, &skill.Tags)
			if err != nil {
				fmt.Println("can't Scan row into variable", err)
			}
			skills = append(skills, util.Skill(skill))
		}
		ctx.JSON(http.StatusOK, skills)
	}
}

func createSkill(ctx *gin.Context) {
	var newSkill util.SkillData
	var skill util.SkillDB

	if err := ctx.ShouldBindJSON(&newSkill); err != nil {
		ctx.Error(err)
	}

	fmt.Println([]string{strings.Join(newSkill.Tags[:], ",")})

	sql := "INSERT INTO skill (key, name, description, logo, tags) values ($1, $2, $3, $4, $5) RETURNING key, name, description, logo, tags"
	row := db.QueryRow(sql, newSkill.Key, newSkill.Name, newSkill.Description, newSkill.Logo, pq.Array(newSkill.Tags))
	err := row.Scan(&skill.Key, &skill.Name, &skill.Description, &skill.Logo, &skill.Tags)

	var res map[string]any
	if err != nil {
		res = map[string]any{
			"status":  "error",
			"message": "Skill already exists",
		}
		fmt.Println("Skill already exists: ", err)
		ctx.JSON(http.StatusNotFound, res)
	} else {
		res = map[string]any{
			"status": "success",
			"data":   util.Skill(skill),
		}
		ctx.JSON(http.StatusOK, res)
	}
}

func updateSkillById(ctx *gin.Context) {
	key := ctx.Param("key")
	var newSkill util.SkillData
	var skill util.SkillDB

	if err := ctx.ShouldBindJSON(&newSkill); err != nil {
		ctx.Error(err)
	}
	var res map[string]any
	row := db.QueryRow("UPDATE skill SET key=$1, name=$2, description=$3, logo=$4, tags=$5 WHERE key=$1 RETURNING key, name, description, logo, tags;",
		key, newSkill.Name, newSkill.Description, newSkill.Logo, pq.Array(newSkill.Tags))
	err := row.Scan(&skill.Key, &skill.Name, &skill.Description, &skill.Logo, &skill.Tags)

	if err != nil {
		res = map[string]any{
			"status":  "error",
			"message": "not be able to update skill",
		}
		fmt.Println("not be able to update skill: ", err)
		ctx.JSON(http.StatusNotFound, res)
	} else {
		res = map[string]any{
			"status": "success",
			"data":   util.Skill(skill),
		}
		ctx.JSON(http.StatusOK, res)
	}
}

func updateNameById(ctx *gin.Context) {
	key := ctx.Param("key")
	var newSkill util.SkillData
	var skill util.SkillDB

	if err := ctx.ShouldBindJSON(&newSkill); err != nil {
		ctx.Error(err)
	}
	var res map[string]any
	row := db.QueryRow("UPDATE skill SET name=$2 WHERE key=$1 RETURNING key, name, description, logo, tags;", key, newSkill.Name)
	err := row.Scan(&skill.Key, &skill.Name, &skill.Description, &skill.Logo, &skill.Tags)

	if err != nil {
		res = map[string]any{
			"status":  "error",
			"message": "not be able to update skill name",
		}
		fmt.Println("not be able to update skill name: ", err)
		ctx.JSON(http.StatusNotFound, res)
	} else {
		res = map[string]any{
			"status": "success",
			"data":   util.Skill(skill),
		}
		ctx.JSON(http.StatusOK, res)
	}
}

func updateDescriptionById(ctx *gin.Context) {
	key := ctx.Param("key")
	var newSkill util.SkillData
	var skill util.SkillDB

	if err := ctx.ShouldBindJSON(&newSkill); err != nil {
		ctx.Error(err)
	}
	var res map[string]any
	row := db.QueryRow("UPDATE skill SET description=$2 WHERE key=$1 RETURNING key, name, description, logo, tags;", key, newSkill.Description)
	err := row.Scan(&skill.Key, &skill.Name, &skill.Description, &skill.Logo, &skill.Tags)

	if err != nil {
		res = map[string]any{
			"status":  "error",
			"message": "not be able to update skill description",
		}
		fmt.Println("not be able to update skill description: ", err)
		ctx.JSON(http.StatusNotFound, res)
	} else {
		res = map[string]any{
			"status": "success",
			"data":   util.Skill(skill),
		}
		ctx.JSON(http.StatusOK, res)
	}
}

func updateLogoById(ctx *gin.Context) {
	key := ctx.Param("key")
	var newSkill util.SkillData
	var skill util.SkillDB

	if err := ctx.ShouldBindJSON(&newSkill); err != nil {
		ctx.Error(err)
	}
	var res map[string]any
	row := db.QueryRow("UPDATE skill SET logo=$2 WHERE key=$1 RETURNING key, name, description, logo, tags;", key, newSkill.Logo)
	err := row.Scan(&skill.Key, &skill.Name, &skill.Description, &skill.Logo, &skill.Tags)

	if err != nil {
		res = map[string]any{
			"status":  "error",
			"message": "not be able to update skill logo",
		}
		fmt.Println("not be able to update skill logo: ", err)
		ctx.JSON(http.StatusNotFound, res)
	} else {
		res = map[string]any{
			"status": "success",
			"data":   util.Skill(skill),
		}
		ctx.JSON(http.StatusOK, res)
	}
}

func updateTagById(ctx *gin.Context) {
	key := ctx.Param("key")
	var newSkill util.SkillData
	var skill util.SkillDB

	if err := ctx.ShouldBindJSON(&newSkill); err != nil {
		ctx.Error(err)
	}
	var res map[string]any
	row := db.QueryRow("UPDATE skill SET tags=$2 WHERE key=$1 RETURNING key, name, description, logo, tags;", key, pq.Array(newSkill.Tags))
	err := row.Scan(&skill.Key, &skill.Name, &skill.Description, &skill.Logo, &skill.Tags)

	if err != nil {
		res = map[string]any{
			"status":  "error",
			"message": "not be able to update skill tags",
		}
		fmt.Println("not be able to update skill tags: ", err)
		ctx.JSON(http.StatusNotFound, res)
	} else {
		res = map[string]any{
			"status": "success",
			"data":   util.Skill(skill),
		}
		ctx.JSON(http.StatusOK, res)
	}
}

func deleteSkillById(ctx *gin.Context) {
	key := ctx.Param("key")
	var res map[string]any

	allSkill := []util.SkillData{}
	rows, err := db.Query("SELECT key, name, description, logo, tags FROM skill ORDER BY key")
	if err != nil {
		fmt.Println("can't get all skill", err)
	} else {
		for rows.Next() {
			var skill = util.SkillDB{}
			err := rows.Scan(&skill.Key, &skill.Name, &skill.Description, &skill.Logo, &skill.Tags)
			if err != nil {
				fmt.Println("can't Scan row into variable", err)
			}
			allSkill = append(allSkill, util.Skill(skill))
		}
	}

	if checkExistKey(allSkill, key) {
		if _, err := db.Exec("DELETE FROM skill WHERE key=$1;", key); err != nil {
			res = map[string]any{
				"status":  "error",
				"message": "not be able to delete skill",
			}
			ctx.JSON(http.StatusNotFound, res)
		} else {
			res = map[string]any{
				"status":  "success",
				"message": "Skill deleted",
			}
			ctx.JSON(http.StatusOK, res)
		}
	} else {
		res = map[string]any{
			"status":  "error",
			"message": "Skill key invalid",
		}
		ctx.JSON(http.StatusNotFound, res)
	}

}

func checkExistKey(allSkill []util.SkillData, key string) bool {
	for _, v := range allSkill {
		if v.Key == key {
			return true
		}
	}
	return false
}
