# Tizen Packaging And Samsung TV Store Submission

## Local packaging

1. Install Tizen Studio, Samsung TV Extension, and Samsung Certificate Extension.
2. Create a Samsung TV certificate profile in Tizen Studio Certificate Manager.
3. Replace the placeholder IDs in `config.xml`.
4. Run `npm run build`.
5. Package the web app as a signed WGT from the `dist` folder.

Example CLI pattern:

```powershell
tizen cli-config "default.profiles.path=C:\path\to\profiles.xml"
tizen package -t wgt -s <your-profile-name> -- E:\code\workspace\FitPulse0\dist
```

The exact output `.wgt` filename depends on your package and application IDs.

## Install on a TV for testing

1. Put the TV and your PC on the same network.
2. Enable Developer Mode on the TV.
3. Add the TV in Device Manager / Remote Device Manager.
4. Install the signed `.wgt` to the target TV.

Typical CLI pattern:

```powershell
sdb devices
tizen install -s <device-serial> --name <your-package>.wgt -- E:\code\workspace\FitPulse0\dist
tizen run -s <device-serial> -p <your-application-id>
```

## Samsung TV Seller Office

For an overseas launch, the critical business constraint is membership type:

- Public Seller: can distribute only in the United States.
- Partner Seller: required for countries outside the United States.

Recommended submission order:

1. Create or confirm your TV Seller Office membership.
2. If you want non-US distribution, request Partner Seller status first.
3. Prepare package, screenshots, icon assets, privacy policy URL, support contact, and QA test credentials.
4. Register the app in TV Seller Office.
5. Upload the signed package and run the automatic Pre-Test.
6. Fill in test information and UI description.
7. Submit for certification.
8. Fix defects if Samsung QA returns issues.
9. After approval, release the app to the selected model groups / countries.

## Submission checklist you should prepare in advance

- Signed `.wgt`
- `config.xml` with correct application ID, version, API version, and screen size
- Author and distributor signatures
- 1920x1080 icon assets and required app images
- At least 4 screenshots
- App description and localized metadata
- Privacy policy URL if you collect personal data
- Support email
- Test account credentials if login is required

## Official references

- TV Seller Office overview:
  https://developer.samsung.com/tv-seller-office
- Seller membership:
  https://developer.samsung.com/tv-seller-office/guides/membership/becoming-seller-office-member.html
- Partner membership:
  https://developer.samsung.com/tv-seller-office/guides/membership/becoming-partner.html
- Entering application information:
  https://developer.samsung.com/tv-seller-office/guides/applications/entering-application-information.html
- Distributing applications:
  https://developer.samsung.com/tv-seller-office/guides/applications/distributing-application.html
- Launch checklist:
  https://developer.samsung.com/tv-seller-office/checklists-for-distribution/launch-checklist.html
- Development checklist:
  https://developer.samsung.com/smarttv/develop/development-checklist/development-checklist.html
- Creating certificates:
  https://developer.samsung.com/smarttv/develop/getting-started/setting-up-sdk/creating-certificates.html
- Tizen CLI packaging:
  https://docs.tizen.org/application/tizen-studio/common-tools/command-line-interface/
