"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function ImageUploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [locationName, setLocationName] = useState("")
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [captureDate, setCaptureDate] = useState("")
  const [imageType, setImageType] = useState("rgb")
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError("Please select a file")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("locationName", locationName)
      formData.append("latitude", latitude)
      formData.append("longitude", longitude)
      formData.append("captureDate", captureDate)
      formData.append("imageType", imageType)

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const data = await response.json()
      router.push(`/analysis/${data.image.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="border-emerald-200">
      <CardHeader>
        <CardTitle className="text-emerald-900">Upload Satellite Image</CardTitle>
        <CardDescription className="text-emerald-700">
          Upload satellite imagery for AI-powered land degradation analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file" className="text-emerald-900">
              Satellite Image
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="border-emerald-300 focus:border-emerald-500"
              />
              <Upload className="h-5 w-5 text-emerald-600" />
            </div>
            {file && <p className="text-sm text-emerald-700">Selected: {file.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="locationName" className="text-emerald-900">
              Location Name
            </Label>
            <Input
              id="locationName"
              placeholder="e.g., Sahel Region, West Africa"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              required
              className="border-emerald-300 focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude" className="text-emerald-900">
                Latitude
              </Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                placeholder="e.g., 14.5"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="border-emerald-300 focus:border-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude" className="text-emerald-900">
                Longitude
              </Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                placeholder="e.g., -14.5"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="border-emerald-300 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="captureDate" className="text-emerald-900">
              Capture Date
            </Label>
            <Input
              id="captureDate"
              type="date"
              value={captureDate}
              onChange={(e) => setCaptureDate(e.target.value)}
              className="border-emerald-300 focus:border-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageType" className="text-emerald-900">
              Image Type
            </Label>
            <Select value={imageType} onValueChange={setImageType}>
              <SelectTrigger className="border-emerald-300 focus:border-emerald-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rgb">RGB</SelectItem>
                <SelectItem value="multispectral">Multispectral</SelectItem>
                <SelectItem value="infrared">Infrared</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload and Analyze"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
