; installer.nsh
; Forces the NSIS install page to show the live file-extraction log
; (Extract: ..., Output folder: ..., Execute: ...) instead of hiding it
; behind the "Show details" toggle.

!macro customHeader
  ShowInstDetails show
!macroend
