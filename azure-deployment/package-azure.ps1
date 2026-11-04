$ErrorActionPreference = "Stop"

$projectRoot = $PSScriptRoot
$archivePath = Join-Path $projectRoot "azure-deployment.zip"
$excludedDirectories = @("node_modules", ".next", ".git", ".vercel", "out", "coverage")

if (Test-Path -LiteralPath $archivePath) {
    Remove-Item -LiteralPath $archivePath -Force
}

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive = [System.IO.Compression.ZipFile]::Open(
    $archivePath,
    [System.IO.Compression.ZipArchiveMode]::Create
)
$fileCount = 0

try {
    $pending = [System.Collections.Generic.Stack[string]]::new()
    $pending.Push($projectRoot)

    while ($pending.Count -gt 0) {
        $directory = $pending.Pop()
        foreach ($item in Get-ChildItem -LiteralPath $directory -Force) {
            if ($item.PSIsContainer) {
                if ($excludedDirectories -notcontains $item.Name) {
                    $pending.Push($item.FullName)
                }
                continue
            }

            if (
                ($item.Name -match '^\.env(\.|$)' -and $item.Name -ne ".env.example") -or
                $item.Extension -eq ".tsbuildinfo" -or
                $item.FullName -eq $archivePath
            ) {
                continue
            }

            $entryName = $item.FullName.Substring($projectRoot.Length).TrimStart("\").Replace("\", "/")
            [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
                $archive,
                $item.FullName,
                $entryName,
                [System.IO.Compression.CompressionLevel]::Optimal
            ) | Out-Null
            $fileCount++
        }
    }

    if ($fileCount -eq 0) {
        throw "No deployable files found in $projectRoot"
    }
}
finally {
    $archive.Dispose()
}

Write-Output "Created $archivePath with $fileCount files."
