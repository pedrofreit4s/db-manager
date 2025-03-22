package template

import (
	"net/http"

	"github.com/CloudyKit/jet/v6"
)

var Templ *TemplateEngine

type Template interface {
	Render(path string, data interface{}, w http.ResponseWriter, r *http.Request)
	GetTemplate() *jet.Set
}

type TemplateEngine struct {
	templ   *jet.Set
	baseDir string
}

// GetTemplate implements Template.
func (t TemplateEngine) GetTemplate() *jet.Set {
	return t.templ
}

// Init implements Template.
func Init(baseDir string) Template {
	Templ = &TemplateEngine{
		templ:   jet.NewSet(jet.NewOSFileSystemLoader(baseDir), jet.InDevelopmentMode()),
		baseDir: baseDir,
	}

	registerGlobalFunctions(Templ.templ)

	return Templ
}

// Render implements Template.
func (t TemplateEngine) Render(path string, data interface{}, w http.ResponseWriter, r *http.Request) {
	view, err := t.templ.GetTemplate(path)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	view.Execute(w, nil, data)
}

// registerGlobalFunctions registers global functions for the template engine.
func registerGlobalFunctions(v *jet.Set) {
	// v.AddGlobalFunc("formatToBRL", func(a jet.Arguments) reflect.Value {
	// 	return reflect.ValueOf(utils.FormatToBRL(a.Get(0).Interface()))
	// })
}
