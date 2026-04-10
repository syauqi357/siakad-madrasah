; uninstaller.nsh
; This script is included by electron-builder for NSIS uninstaller configuration.

!macro un.RemoveRegKey
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_ID}"
  DeleteRegKey HKLM "Software\${PRODUCT_NAME}"
!macroend

!macro un.RemoveFiles
  ; Remove files and directories created by the installer
  RMDir /r "$INSTDIR"
!macroend

!macro un.RemoveShortcuts
  ; Remove Start Menu shortcuts
  Delete "$SMPROGRAMS\${PRODUCT_NAME}\${PRODUCT_NAME}.lnk"
  Delete "$SMPROGRAMS\${PRODUCT_NAME}\Uninstall ${PRODUCT_NAME}.lnk"
  RMDir "$SMPROGRAMS\${PRODUCT_NAME}"

  ; Remove Desktop shortcut (if created)
  Delete "$DESKTOP\${PRODUCT_NAME}.lnk"
!macroend

Section "Uninstall"
  ; Call the macros to perform uninstallation steps
  !insertmacro un.RemoveShortcuts
  !insertmacro un.RemoveFiles
  !insertmacro un.RemoveRegKey

  ; Remove the uninstaller itself
  Delete "$INSTDIR\uninstall.exe"

  ; Remove the installation directory if it's empty
  RMDir "$INSTDIR"

  MessageBox MB_OK "SIAKAD Madrasah has been successfully uninstalled."
SectionEnd
