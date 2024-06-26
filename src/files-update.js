import { readFileSync, writeFileSync } from 'fs'
import { valid } from 'semver'
import { setFailed } from '@actions/core'

async function setPackageFileVersion(newVersion) {
  validateVersions(newVersion)
  try {
    // read file
    const file = readFileSync('package.json', 'utf-8')
    const json = JSON.parse(file)
    // update version
    json.version = newVersion
    // write file
    writeFileSync('package.json', JSON.stringify(json, null, '\t'))
  } catch (e) {
    setFailed(e)
  }
}

async function setManifestFileVersion(newVersion) {
  validateVersions(newVersion)
  try {
    // read file
    const file = readFileSync('manifest.json', 'utf-8')
    const json = JSON.parse(file)
    // update version
    json.version = newVersion
    // write file
    writeFileSync('manifest.json', JSON.stringify(json, null, '\t'))
  } catch (e) {
    setFailed(e)
  }
}

async function setVersionsFileVersion(newVersion, minAppVersion) {
  validateVersions([newVersion, minAppVersion])
  try {
    // read file
    const file = readFileSync('versions.json', 'utf-8')
    const json = JSON.parse(file)
    let entries = Object.keys(json)
    // remove existing versions with same minAppVersion
    entries.forEach(key => {
      if (minAppVersion === json[key]) {
        delete json[key]
      }
    })
    // add new entry for new version with minAppVersion
    json[newVersion] = minAppVersion
    // write file
    writeFileSync('versions.json', JSON.stringify(json, null, '\t'))
  } catch (e) {
    setFailed(e)
  }
}

async function getMinAppVersion() {
  try {
    // read file
    const file = readFileSync('manifest.json', 'utf-8')
    const json = JSON.parse(file)
    // get minAppVersion
    const { minAppVersion } = json
    return minAppVersion
  } catch (e) {
    setFailed(e)
  }
}

function validateVersions(versions = []) {
  versions.forEach(v => {
    if (valid(v) !== null) {
      setFailed(`Invalid version received! ${v}`)
    }
  })
}

module.exports = {
  setPackageFileVersion,
  setManifestFileVersion,
  setVersionsFileVersion,
  getMinAppVersion
}
