package account

import (
	"time"

	"golang.org/x/crypto/bcrypt"
)

// Account represents a user account in the system
type Account struct {
	ID   uint   `gorm:"primarykey"`
	UUID string `gorm:"type:uuid;default:uuid_generate_v4();index"`

	Email    string `gorm:"type:varchar(255);not null;unique;index"`
	Password string `gorm:"type:varchar(255);not null"`
	IsActive bool   `gorm:"default:true"`

	CreatedAt time.Time `gorm:"index"`
	UpdatedAt time.Time `gorm:"index"`
}

// BeforeSave is a GORM hook that hashes the password before saving to the database
// It only hashes the password if it has been changed (length > 0)
func (a *Account) BeforeSave() error {
	if len(a.Password) > 0 {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(a.Password), bcrypt.DefaultCost)
		if err != nil {
			return err
		}
		a.Password = string(hashedPassword)
	}
	return nil
}
