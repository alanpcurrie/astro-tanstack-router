module Hello exposing (main)

import Html exposing (Html, div, p, text)
import Html.Attributes exposing (class, style)


main : Html msg
main =
    div [ class "container main-content" ]
        [ text "Hello world"
        , p
            [ class "greeting"
            , style "color" "blue"
            , style "font-size" "24px"
            , style "margin-top" "20px"
            ]
            [ text "HI FROM ELM!!!" ]
        ]
