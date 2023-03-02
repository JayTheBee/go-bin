package model

func GetAllGobins() ([]Gobin, error) {
	var golies []Gobin

	tx := db.Find(&golies)
	if tx.Error != nil {
		return []Gobin{}, tx.Error
	}

	return golies, nil
}

func GetGobin(id uint) (Gobin, error) {
	var x Gobin

	tx := db.Where("id = ?", id).First(&x)

	if tx.Error != nil {
		return Gobin{}, tx.Error
	}

	return x, nil
}

func CreateGobin(x Gobin) error {
	tx := db.Create(&x)
	return tx.Error
}

func UpdateGobin(x Gobin) error {

	tx := db.Save(&x)
	return tx.Error
}

func DeleteGobin(id uint) error {

	tx := db.Unscoped().Delete(&Gobin{}, id)
	return tx.Error
}

func FindByURL(url string) (Gobin, error) {
	var x Gobin
	tx := db.Where("url = ?", url).First(&x)
	return x, tx.Error
}
